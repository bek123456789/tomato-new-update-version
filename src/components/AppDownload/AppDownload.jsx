import "./AppDownload.css";

const AppDownload = () => {
  return (
    <div className="app-download" id="app-download">
      <p>
        For better experience download <br /> Tomato app
      </p>
      <div className="app-download-platforms">
        <img src="./assets/play_store.png" alt="play store" />
        <img src="./assets/app_store.png" alt="app store" />
      </div>
    </div>
  );
};

export default AppDownload;
