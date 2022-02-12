import { faHome, faSearch } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Link from 'next/link'
import React from 'react'

export default function BottomMenuBar ({ className }) {
  return (
    <div className={'fixed bottom-0 w-full h-12 bg-white ' + className}>
      <div className='flex justify-between h-full shadow-card'>
        <Link href='/' passHref>
          <div className='flex w-full items-center justify-center cursor-pointer'>
            <FontAwesomeIcon icon={faHome} />
          </div>
        </Link>
        <Link href='/search' passHref>
          <div className='flex w-full items-center justify-center cursor-pointer'>
            <FontAwesomeIcon icon={faSearch} />
          </div>
        </Link>
      </div>
    </div>
  )
}
