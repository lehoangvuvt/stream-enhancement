import Image from "next/image";
import logo from "/public/image/logo.png";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/")}
      style={{
        cursor: "pointer",
        position: "relative",
        width: "100%",
        height: "100px",
        marginBottom: "5px",
      }}
    >
      <Image
        fill
        style={{ objectFit: "cover", pointerEvents: "none" }}
        alt="logo"
        src={logo.src}
      />
    </div>
  );
};

export default Logo;
