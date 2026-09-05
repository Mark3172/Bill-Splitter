const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <p>© {new Date().getFullYear()} Myo Set Paing. All rights reserved.</p>
        <p className="footer-credit">Designed &amp; built with React + Vite</p>
      </div>
    </footer>
  );
};

export default Footer;
