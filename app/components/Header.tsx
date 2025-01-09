import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import img from "@/public/movie.png"
const Header = () => {
  
  return (
    <header className='flex items-center justify-between px-12  text-white py-4 z-10'>
        <h1 className='textGradient text-2xl'>Sync Space</h1>
        <div className='flex items-center gap-4'>
            <div className='flex items-center gap-2'>
              <p> hello user </p>
              <div className='w-12 h-12 rounded-full flex items-center justify-center'>
                <Image src={img} alt='user photo'/>
              </div>
            </div>
        </div>
    </header>
  )
}

export default Header