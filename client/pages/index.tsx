import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {useState} from "react";
import {UserServiceClientJSON} from "../generated/proto/user/user.twirp";
import {User} from "../generated/proto/user/user";
import {AxiosRpcClient} from "../apiclient/axios";
import {TwirpError} from "twirp-ts";
import { AuthorizationServiceClientJSON } from '../generated/proto/auth/authorizqation.twirp';


const Home: NextPage = () => {
    const [user, setUser] = useState<User | null>(null);
    
    const getUser = async () => {
        const jsonClient = new UserServiceClientJSON(AxiosRpcClient);
            const res = await jsonClient.GetUser({id: "dummyId"})
            if (res.user) {
                setUser(res.user)
            }
    }
    
    const authorize = async () => {
        const jsonClient = new AuthorizationServiceClientJSON(AxiosRpcClient);
        try {
            await jsonClient.Authorize({})
        } catch (e) {
            // これでエラーハンドリングできる
            if (e instanceof TwirpError) {
                console.error(e.code)
                console.error(e.message)
                console.error(e.meta)
                alert(e.code+ ": " + e.message)
            }
        }
    }

    return (
        <div className={styles.container}>
            <Head>
                <title>Twirp Playground</title>
                <meta name="description" content="Twirp playground"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>

            <main className={styles.main}>
                <h1 className={styles.title}>
                    Welcome to <a href="https://github.com/p1ass/twirp-playground">Twirp Playground!</a>
                </h1>

                <div className={styles.api}>
                    <h2>Get User API</h2>
                    <button type='button' onClick={()=> getUser()}>Call GetUser</button>

                    <p>id: {user?.id}</p>
                    <p>name: {user?.name}</p>
                </div>

                <div className={styles.api}>
                    <h2>Authorize API (Always PermissionDenied Error)</h2>
                    <button type='button' onClick={()=> authorize()}>Call Authorize</button>
                </div>
            </main>
        </div>
    )
}

export default Home
