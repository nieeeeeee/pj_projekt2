import Navbar from "~/app/_components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import { getServerSession } from "next-auth";
import { authOptions } from "~/server/auth";
// import ApartmentCard from "~/components/ApartmentCard";
// coś ne tak z tym
// import 'bootstrap/dist/js/bootstrapped.js';



export default async function Home() {
  const session = await getServerSession(authOptions);
  const isLoggedIn = !!session?.user;
  return (
    <>
      <Navbar isLoggedIn={isLoggedIn} user={session?.user} />
    </>
  );
}
