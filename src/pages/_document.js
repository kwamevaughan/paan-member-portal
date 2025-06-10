import Document, { Html, Head, Main, NextScript } from "next/document";

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          {/* Preload Google Fonts for Questrial */}
          <link
            rel="preload"
            href="https://fonts.googleapis.com/css2?family=Questrial&display=swap"
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />

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
          <meta
            name="description"
            content="The Pan African Agency Network (PAAN) membership portal is designed as a dynamic platform where agencies across Africa and the diaspora can connect, grow, and access opportunities. Whether you're a Founding Member, a Full Member, or an Associate Member, the portal is your go-to hub for business opportunities, updates, market intelligence, events, resources, and exclusive offers tailored to your membership tier."
          />

          {/* Google Tag Manager Script */}
          <script
            async
            src="https://www.googletagmanager.com/gtag/js?id=G-FT1JTM65Y1"
          ></script>
          <script>
            {`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-FT1JTM65Y1');
            `}
          </script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
