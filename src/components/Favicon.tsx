import Image from "next/image";
import favicon from "../../public/favicon.svg";

export default function Favicon(props: { className?: string }) {
  return (
    <Image
      color="white"
      src={favicon}
      alt="Joblink Logo"
      className={props.className}
    />
  );
}