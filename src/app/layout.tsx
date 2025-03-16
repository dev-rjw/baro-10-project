import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>TODO LIST</title>
        <meta name="description" content="TODO LIST"></meta>
        <meta name="keywords" content="Next.js, TypeScript, React"></meta>
        <meta name="author" content="Jiwon Ryu"></meta>
      </head>
      <body>{children}</body>
    </html>
  );
}
