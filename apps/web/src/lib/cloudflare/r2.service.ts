import {
    S3Client,
    PutObjectCommand,
    ListObjectsV2Command,
    GetObjectCommand,
    DeleteObjectCommand,
    type _Object,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";

export type UploadResult =
    | {
        success: true;
        url: string;
        key: string; // Add key to successful result
    }
    | {
        success: false;
        error: string;
        details?: string;
    };

export type ListFilesResult =
    | {
        success: true;
        files: FileInfo[];
    }
    | {
        success: false;
        error: string;
        details?: string;
    };

export type FileInfo = {
    key: string;
    url: string;
    size: number;
    lastModified: Date;
    metadata?: Record<string, string>;
};

export type DeleteResult =
    | {
        success: true;
    }
    | {
        success: false;
        error: string;
        details?: string;
    };

class R2Service {
    private folder = 'images'
    private client: S3Client;

    constructor() {
        this.client = new S3Client({
            region: "auto",
            endpoint: `https://${env.R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
            credentials: {
                accessKeyId: env.R2_ACCESS_KEY_ID,
                secretAccessKey: env.R2_SECRET_ACCESS_KEY,
            },
        });
    }

    ///////////////////////////////////////////////
    // Utility method to get metadata for a file
    ///////////////////////////////////////////////
    async getMetadata(key: string): Promise<Record<string, string> | null> {
        try {
            const command = new GetObjectCommand({
                Bucket: env.R2_BUCKET_NAME,
                Key: key,
            });

            const response = await this.client.send(command);
            return response.Metadata ?? null;
        } catch (error) {
            console.error("R2 get metadata failed:", error);
            return null;
        }
    }

    ///////////////////////////////////////////////
    // Private methods
    ///////////////////////////////////////////////

    private generateKey(fileName: string): string {
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 8);
        return `${this.folder}/${timestamp}-${randomString}-${fileName}`;
    }

    private getPublicUrl(key: string): string {
        return `${env.R2_PUBLIC_DOMAIN}/${key}`;
    }

    ///////////////////////////////////////////////
    // Public methods
    ///////////////////////////////////////////////

    async getPresignedUploadUrl(
        fileName: string,
        fileType: string,
    ): Promise<UploadResult> {
        try {
            const key = this.generateKey(fileName);

            const command = new PutObjectCommand({
                Bucket: env.R2_BUCKET_NAME,
                Key: key,
                ContentType: fileType,
                Metadata: {
                    originalName: fileName,
                    uploadedAt: new Date().toISOString(),
                },
            });

            const url = await getSignedUrl(this.client, command, { expiresIn: 3600 });

            return {
                success: true,
                url,
                key,
            };
        } catch (error) {
            console.error("Failed to generate presigned URL:", error);
            return {
                success: false,
                error: "Failed to generate presigned URL",
                details:
                    error instanceof Error ? error.message : "Unknown error occurred",
            };
        }
    }

    async uploadFile(file: File): Promise<UploadResult> {
        try {
            const key = this.generateKey(file.name);
            const buffer = await file.arrayBuffer();

            await this.client.send(
                new PutObjectCommand({
                    Bucket: env.R2_BUCKET_NAME,
                    Key: key,
                    Body: Buffer.from(buffer),
                    ContentType: file.type,
                    Metadata: {
                        originalName: file.name,
                        uploadedAt: new Date().toISOString(),
                    },
                }),
            );

            return {
                success: true,
                url: this.getPublicUrl(key),
                key: key, // Return the key in the result
            };
        } catch (error) {
            console.error("R2 upload failed:", error);
            return {
                success: false,
                error: "Upload failed",
                details:
                    error instanceof Error ? error.message : "Unknown error occurred",
            };
        }
    }

    async listFiles(prefix?: string): Promise<ListFilesResult> {
        try {
            const command = new ListObjectsV2Command({
                Bucket: env.R2_BUCKET_NAME,
                Prefix: prefix,
                MaxKeys: 1000, // Adjust as needed
            });

            const response = await this.client.send(command);

            if (!response.Contents) {
                return {
                    success: true,
                    files: [],
                };
            }

            const files: FileInfo[] = response.Contents.map((obj: _Object) => ({
                key: obj.Key!,
                url: this.getPublicUrl(obj.Key!),
                size: obj.Size!,
                lastModified: obj.LastModified!,
                metadata: {}, // Metadata requires separate HEAD request if needed
            }));

            return {
                success: true,
                files,
            };
        } catch (error) {
            console.error("R2 list failed:", error);
            return {
                success: false,
                error: "Failed to list files",
                details:
                    error instanceof Error ? error.message : "Unknown error occurred",
            };
        }
    }

    async getFile(key: string): Promise<Blob | null> {
        try {
            const command = new GetObjectCommand({
                Bucket: env.R2_BUCKET_NAME,
                Key: key,
            });

            const response = await this.client.send(command);

            if (!response.Body) {
                return null;
            }

            // Convert the readable stream to a blob
            const arrayBuffer = await response.Body.transformToByteArray();
            return new Blob([arrayBuffer], { type: response.ContentType });
        } catch (error) {
            console.error("R2 get file failed:", error);
            return null;
        }
    }

    async deleteFile(key: string): Promise<DeleteResult> {
        try {
            const command = new DeleteObjectCommand({
                Bucket: env.R2_BUCKET_NAME,
                Key: key,
            });

            await this.client.send(command);

            return {
                success: true,
            };
        } catch (error) {
            console.error("R2 delete failed:", error);
            return {
                success: false,
                error: "Failed to delete file",
                details:
                    error instanceof Error ? error.message : "Unknown error occurred",
            };
        }
    }

    async deleteFiles(keys: string[]): Promise<DeleteResult> {
        for (const key of keys) {
            await this.deleteFile(key);
        }
        return { success: true };
    }

    async uploadFiles(files: File[]): Promise<UploadResult> {
        const results = await Promise.all(files.map(file => this.uploadFile(file)));
        const failed = results.find(result => !result.success);
        if (failed) return failed;

        // Return the last successful upload's details
        const lastResult = results[results.length - 1] as Extract<UploadResult, { success: true }>;
        return {
            success: true,
            url: lastResult.url,
            key: lastResult.key
        };
    }
}

// Export a singleton instance
export const r2Service = new R2Service();
