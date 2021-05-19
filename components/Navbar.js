import Link from 'next/link'
import { useContext } from 'react'
import { UserContext } from '../lib/context'

export default function Navbar() {
    const { user, username } = useContext(UserContext)
    return (
        <nav className="navbar">
            <ul>
                <li>
                    <Link href="/">
                        <button className="btn-logo"> Feed </button>
                    </Link>
                </li>
                {/* If user is logged In  */}
                {username && (
                    <>
                        <li className="push-left">
                            <Link href="/admin">
                                <button className="btn-blue"> Write Posts</button>
                            </Link>
                        </li>

                        <li>
                            <Link href={`/${username}`}>
                                <img src={user?.photoURL} />
                            </Link>
                        </li>
                    </>
                )}



                {/* If user is not signed or not created username */}

                {!username && (
                    <>
                        <Link href="/enter">
                            <button className="btn-blue"> Sign Up</button>
                        </Link>
                    </>
                )}

            </ul>
        </nav>
    )
}

