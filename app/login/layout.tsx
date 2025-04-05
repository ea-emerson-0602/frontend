// app/login/layout.tsx
export const metadata = {
    title: "Login",
    description: "User login page",
  };
  
  export default function LoginLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return <>{children}</>;
  }