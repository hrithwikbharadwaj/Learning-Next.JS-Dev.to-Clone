import { useContext, useEffect, useState, useCallback } from 'react';
import { auth, firestore, googleAuthProvider } from '../lib/firebase'
import { UserContext } from '../lib/context'
import debounce from 'lodash.debounce'
export default function EnterPage({ }) {
    // if user is not logged in Siginbutton
    // if user is signed in but no username then 
    // username form
    // if user is signed in then log out button
    const { user, username } = useContext(UserContext)
    return (
        <main>
            {user ?
                !username ? <UsernameForm /> : <SignOutButton />
                : <SigninButton />

            }
        </main>
    )
}

function SigninButton() {
    const signInWithGoogle = async () => {
        await auth.signInWithPopup(googleAuthProvider);

    }
    return (
        <button className="btn-google" onClick={signInWithGoogle}>
            <img src="googleLogo.png" /> Sign in with Google
        </button>

    )
}

function SignOutButton() {
    return (
        <button className="btn-logout" onClick={() => auth.signOut()}> Logout</button>
    )

}
function UsernameForm() {
    const [formValue, setFormValue] = useState('')
    const [isValid, setIsValid] = useState(false)
    const [loading, setLoading] = useState(false)

    const { user, username } = useContext(UserContext)

    useEffect(() => {
        checkUsername(formValue)
    }, [formValue])

    const checkUsername = useCallback(
        debounce(async (username) => {
            if (username.length >= 3) {
                const ref = firestore.doc(`usernames/${username}`)

                const { exists } = await ref.get();

                console.log("Firestore read done")
                setIsValid(!exists)
                setLoading(false)

            }
        }, 500),
        []
    );

    const onChange = (e) => {
        const val = e.target.value.toLowerCase();
        if (val.length < 3) {
            setFormValue(val)
            setLoading(false)
            setIsValid(false)
        }
        setLoading(true)
        setIsValid(false)
        setFormValue(val)
    }

    const onSubmit = async (e) => {
        e.preventDefault()
        try {
            const userDoc = firestore.doc(`users/${user.uid}`)
            const usernameDoc = firestore.doc(`usernames/${formValue}`)

            const batch = firestore.batch()

            batch.set(userDoc, { username: formValue, photoURL: user.photoURL, displayName: user.displayName })
            batch.set(usernameDoc, { uid: user.uid })
            await batch.commit()
        }
        catch (err) {
            console.log(err)
        }


    };







    return (

        !username && (
            <section>
                <h3> Choose Your Username </h3>

                <form onSubmit={onSubmit}>
                    <input name="username" placeholder="username" value={formValue} onChange={onChange} ></input>
                    <UsernameMessage username={formValue} isValid={isValid} loading={loading} />
                    <button type="submit" className="btn-green" disabled={!isValid}>
                        Choose
            </button>
                    <h3>Debug State</h3>
                    <div>
                        Username : {formValue}
                        <br />
                Loading: {loading}
                        <br />
                Username Valid: {isValid.toString()}
                    </div>
                </form>
            </section>
        )


    )

}

function UsernameMessage({ username, isValid, loading }) {
    if (loading) {
        return <p> Loading.....</p>
    }

    else if (isValid) {
        return <p className="text-success">{username} is available </p>
    }
    else if (username && !isValid) {
        return <p className="text-danger"> That username is taken!</p>
    }
    else {
        return <p> </p>
    }
}