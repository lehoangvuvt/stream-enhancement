import Image from "next/image";
import logo from "/public/image/logo.png";
import { useRouter } from "next/navigation";

const Logo = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push("/search")}
      style={{
        cursor: "pointer",
        position: "relative",
        width: "70%",
        aspectRatio: 1,
        marginBottom: "20px",
      }}
    >
      <Image
        fill
        style={{ objectFit: "contain", pointerEvents: "none" }}
        alt="logo"
        src={logo.src}
      />
    </div>
  );
};

export default Logo;
