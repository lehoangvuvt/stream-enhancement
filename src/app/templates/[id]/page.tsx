const Page = ({ params }: { params: { id: string } }) => {
  let bg = "";
  switch (params.id) {
    case "1":
      bg =
        "https://marketplace.canva.com/EAE-DjUuNCg/1/0/1600w/canva-black-and-turquoise-futuristic-twitch-webcam-overlay-template-9JzFgOqnVtw.jpg";
      break;
    case "2":
      bg =
        "https://static.vecteezy.com/system/resources/previews/006/555/783/non_2x/modern-screen-panel-overlay-frame-set-design-template-for-games-streaming-free-vector.jpg";
      break;
  }
  return (
    <div
      style={{
        backgroundImage: `url("${bg}")`,
        width: "100%",
        height: "100%",
        position: "absolute",
        top: 0,
        left: 0,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <h1>{params.id}</h1>
    </div>
  );
};

export default Page;
