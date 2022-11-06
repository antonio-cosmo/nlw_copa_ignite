import Image from 'next/image'
import {useRouter} from 'next/router'
import appPreviewImg from '../assets/app-nlw-copa-preview.png'
import logoImg from '../assets/logo.svg'
import usersAvatarExampleImg from '../assets/users-avatar-example.png'
import iconCheckImg from '../assets/icon-check.svg'
import { api } from '../lib/axios'
import { FormEvent, useState } from 'react'

interface HomeProps{
  poolCount: number,
  userCount: number,
  guessCount: number
}
export default function Home({poolCount, guessCount, userCount}:HomeProps) {
  const [poolTitle, setPoolTitle] = useState('')
  const route = useRouter()
  console.log(poolTitle)
  const createPool = async (event: FormEvent)=>{
    event.preventDefault()
    try{
      const codeResponse = await api.post('/pools',{title: poolTitle})
      const {code} = codeResponse.data
      await navigator.clipboard.writeText(code)
      setPoolTitle('')
      alert('Bolão criado com sucesso, o codigo foi copiado para área de transferencia')
      route.reload()
    }catch(e){
      console.log(e)
      alert('Falha ao criar bolão')
    }

  }
  return (
    <div className='max-w-[1124px]  mx-auto grid grid-cols-2 gap-28 items-center p-6'>
      <main>
        <Image src={logoImg} alt='NLW Copa'/>
        <h1 className='mt-14 text-white text-5xl font-bold leading-tight'>
          Crie seu própio bolão da copa e compartilhe entre amigos
        </h1>

        <div className='mt-10 flex items-center gap-2'>
          <Image src={usersAvatarExampleImg} alt=''/>
          <strong className='text-gray-100 text-xl'>
            <span className='text-ignite-500'>+{userCount}</span> pessoas ja estão usando
          </strong>
        </div>

        <form onSubmit={createPool} className='mt-10 flex gap-2'>
          <input 
            className='flex-1 px-6 py-4 rounded bg-gray-800 border border-gray-600 text-sm text-gray-100'
            type="text" 
            required placeholder='Qual nome do seu bolão' 
            value={poolTitle}
            onChange={e => setPoolTitle(e.target.value)}
          />
          <button 
            className='bg-yellow-500 px-6 py-4 rounded text-gray-900 font-bold text-sm uppercase hover:bg-yellow-700'
            type='submit'
          >
            Criar meu bolão
          </button>
        </form>

        <p className='mt-4 text-sm text-gray-300 leading-relaxed'>
          Após criar seu bolão, você receberá um código único que poderá
          usar para convidar outras pessoas
        </p>

        <div className='mt-10 pt-10 border-t border-gray-600 flex items-center justify-between text-gray-100 '>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt=''/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{poolCount}</span>
              <span>Bolões criados</span>
            </div>
          </div>
          <div className='w-px h-14 bg-gray-600'></div>
          <div className='flex items-center gap-6'>
            <Image src={iconCheckImg} alt=''/>
            <div className='flex flex-col'>
              <span className='font-bold text-2xl'>+{guessCount}</span>
              <span>Palpites enviados</span>
            </div>
          </div>
        </div>
      </main>
      <Image src={appPreviewImg} alt="Dois celulares exibindo previa da aplicação" />
    </div>
  )
}


export async function getServerSideProps() {

  const [poolCount, userCount, guessCount] = await Promise.all([
    api.get('/pools/count'),
    api.get('/users/count'),
    api.get('/guesses/count')
  ])
  return{
    props:{
      poolCount: poolCount.data.count,
      userCount: userCount.data.count,
      guessCount: guessCount.data.count
    }
  }
}
