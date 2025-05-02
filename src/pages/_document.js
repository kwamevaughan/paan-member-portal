import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          
          {/* Favicon Links */}
          <link rel="icon" href="/favicon.png" />
          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href="/apple-touch-icon.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href="/favicon-32x32.png"
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href="/favicon-16x16.png"
          />
          <title>PAAN - Membership Portal</title>
          {/* Page Description Meta Tag */}
          <meta
            name="description"
            content="The Pan African Agency Network (PAAN) membership portal is designed as a dynamic platform where agencies across Africa and the diaspora can connect, grow, and access opportunities. Whether you're a Founding Member, a Full Member, or an Associate Member, the portal is your go-to hub for business opportunities, updates, market intelligence, events, resources, and exclusive offers tailored to your membership tier."
          />
          {/* Google Tag Manager Script */}
        </Head>
        <body>
          {/* Google Tag Manager (noscript) */}

          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
