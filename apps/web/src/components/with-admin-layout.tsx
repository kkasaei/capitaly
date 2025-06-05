"use client";



interface WithAdminLayoutProps {
  children: React.ReactNode;
}

export function WithAdminLayout({ children }: WithAdminLayoutProps) {

  return (
    <>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 md:px-8">    {children}</div>
      </div>
    </>
  );
}

export default function withAdminLayout<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function WithAdminLayoutWrapper(props: P) {
    return (
      <WithAdminLayout>
        <WrappedComponent {...props} />
      </WithAdminLayout>
    );
  };
}
