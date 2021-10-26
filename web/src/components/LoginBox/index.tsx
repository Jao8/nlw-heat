import styles from './styles.module.scss'
import {VscGithubInverted} from 'react-icons/vsc'
import { useContext, useEffect } from 'react'
import { api } from '../../services/api'
import { AuthContext } from '../../contexts/auth'



export function LoginBox() {

    const {signInURL} = useContext(AuthContext);
    

    return(
        <div className={styles.loginBoxWrapper}>
            <strong>Entre e compartilhe sua menssagem</strong>
            <a href={signInURL} className={styles.signInWithGithub}>
                <VscGithubInverted size={24} />
                Entrar com o GitHub
            </a>
        </div>
    )
}