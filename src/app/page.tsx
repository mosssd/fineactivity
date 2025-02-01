import Image from "next/image";
import Nav from "./components/Nav";

export default function Home() {
  return (
    <main>
      <Nav />
      //เขียนข้อความต้อนรับ
      <h1 className="text-4xl text-center mt-16">Welcome to my website</h1>
  
    </main>
  );
}
