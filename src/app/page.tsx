import Link from "next/link";
import Navbar from "~/app/_components/Navbar";
import styles from "./index.module.css";
import 'bootstrap/dist/css/bootstrap.min.css';
// import ApartmentCard from "~/components/ApartmentCard";
// coś ne tak z tym
// import 'bootstrap/dist/js/bootstrapped.js';

const mockUser = {
    name: "John Doe",
    email: "john@example.com",
};



export default function Home() {
    return (
        <>
            <Navbar currentPage={1} isLoggedIn={false}/>


        </>
    );
}