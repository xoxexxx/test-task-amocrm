import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAppStore, useLocalStore } from '../store';

import axios from 'axios';

const OAuthCallback = () => {
  const location = useLocation();
  const {
    client_id,
    client_secret,
  } = useAppStore(state => state);

  const {access_token, setAccessToken} = useLocalStore(state => state);
  const [error, setError] = useState<number | string | null>(null)

  const getCodeFromUrl = () => {
    const params = new URLSearchParams(location.search);
    return params.get('code');
  };

  useEffect(() => {
    const authorizationCode = getCodeFromUrl();

    if (authorizationCode) {
      console.log('Authorization code:', authorizationCode);
      exchangeCodeForToken(authorizationCode);
    }
  }, [location]);

  const exchangeCodeForToken = async (code: string) => {
    try {
      const response = await axios.post('https://cors-anywhere.herokuapp.com/https://yabzhk.amocrm.ru/oauth2/access_token', {
        "grant_type": 'authorization_code',
        "client_id": client_id,
        "client_secret": client_secret,
        "redirect_uri": 'http://localhost:3000/oauth',
        "code": code,
      }).then((res: any) => {
        if (res.data.access_token) {
          setAccessToken(res.data.access_token);
          console.log('Access Token:', res.data.access_token);
        } else {
          console.error('Ошибка при получении токена:', res);
          setError('Ошибка при получении токена:')
        }
      }).catch((error) => {
        console.log(error.message)
        if (error.message === "Request failed with status code 429") {
          setError("Too Many Requests. Failed with status code 429")
          console.error(error.message);
      } else {
          console.error("Unhandled error: ", error.message);
          setError("Please, complete  cross-origin requests to anywhere https://cors-anywhere.herokuapp.com/")
      }
      })

    } catch (error) {
      console.error('Ошибка:', error);
    }
  };

  return (
    <div className='flex flex-col min-h-screen h-full items-center justify-center'>
      <h2>Обработка авторизации через AmoCRM...</h2>
      <h4>{error}</h4>
      <h5>Provide to <a className='text-blue-600' href='https://cors-anywhere.herokuapp.com/' target='_blank'>https://cors-anywhere.herokuapp.com/</a></h5>
    </div>
  );
};

export default OAuthCallback;
