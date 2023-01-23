const htmlPageForResetPass = (logo, url) => {
  return ` <html lang="en" dir="rtl">
    <head>
      <meta charset="UTF-8" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Document</title>
    </head>
    <body
      style="
        @import url('https://fonts.googleapis.com/css2?family=Amatic+SC:wght@400;700&family=Caveat:wght@500&family=Comic+Neue:wght@300&family=Dosis:wght@300&family=Fira+Sans:wght@300&family=Karantina:wght@300&family=Montserrat:wght@300;500&family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;1,300;1,400;1,500;1,600;1,700;1,800&family=Rubik+Vinyl&family=Varela+Round&display=swap');
        font-family: 'Open Sans', sans-serif;
        /* margin: 0; */
        padding: 0;
        box-sizing: border-box;
        margin: 5vh 20vw;
      "
    >
      <div style="width: 100%; height: 100%">
        <div
          style="
            background: rgb(0, 0, 0);
            width: 470px;
            height: 670px;
            border-radius: 30px;
          "
        >
          <div
            style="
              width: 100%;
              padding-left: 10%;
              padding-right: 50%;
              padding-top: 30px;
              margin-bottom: 100px;
              display: flex;
              flex-direction: row;
              align-items: center;
              gap: 15px;
            "
          >
            <img src=${logo} alt="logo" />
            <div style="color: aliceblue; font-size: 26px; font-weight: 100">
              Accutures
            </div>
          </div>
          <div
            style="color: rgb(255, 255, 255); width: 100%; margin-bottom: 100px"
          >
            <div
              style="
                width: 100%;
                padding-left: 12%;
                padding-right: 12%;
                margin-top: 50px;
                margin-bottom: 22%;
                font-size: 18px;
                line-height: 30px;
                word-spacing: 3pt;
              "
            >
              You have requested to reset your password
            </div>
            <div
              style="
                width: 85%;
                padding-left: 10%;
                padding-right: 10%;
                font-size: 15px;
                line-height: 30px;
              "
            >
              We cannot simply send you your old password. A unique link to reset
              your password has been generated for you. To reset your password,
              click the following link and follow the instructions.
            </div>
          </div>
          <button
            style="
              width: 180px;
              height: 40px;
              margin-left: 32%;
              margin-right: 32%;
              background: #56c493;
              color: aliceblue;
              font-size: 13px;
              font-weight: 900;
              border: none;
              border-radius: 30px;
            "
          >
            <a
              id="linkForEmail"
              style="color: aliceblue; text-decoration: none"
              href=${url}
            >
              RESET PASSWORD
            </a>
          </button>
        </div>
      </div>
    </body>
  </html>
  `;
};

module.exports = { htmlPageForResetPass };
