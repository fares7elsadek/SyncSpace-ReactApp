import { Github, Linkedin } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='py-4 px-4 md:px-24 flex flex-col text-white gap-4 footerGradiant'>
        <div className='flex justify-between'>
            <div className=' flex flex-col gap-2'>
                <p>Abdullah yosry</p>
                <div className='flex justify-around'>
                    <Link href={""}>
                        <Linkedin className='border rounded-full w-10 h-10 p-1'/>
                    </Link>
                    <Link href={""}>
                        <Github className='border rounded-full w-10 h-10 p-1'/>
                    </Link>
                </div>
            </div>
            <div className=' flex flex-col gap-2'>
                <p>Fares Alsadek</p>
                <div className='flex justify-around '>
                    <Link href={""}>
                        <Linkedin className='border rounded-full w-10 h-10 p-1'/>
                    </Link>
                    <Link href={""}>
                        <Github className='border rounded-full w-10 h-10 p-1'/>
                    </Link>
                </div>
            </div>

        </div>
        <div className='flex flex-col gap-2 items-center'>
            <p className=''>Two computer science students at Ain Shams University leveraged their skills to create ScreenMates, a website that showcases their expertise in web development.</p>
            <p className=''>© 2025 Copyright: Sync Space </p>
        </div>
    
    </footer>
  )
}

export default Footer
