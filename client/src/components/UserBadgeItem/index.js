import { CloseIcon } from '@chakra-ui/icons'
import { Box } from '@chakra-ui/react'
import React from 'react'
import './UserBadgeItem.css'

const UserBadgeItem = ({user, handleFunction}) => {
  return (
    <Box className='badgeMainComponent' onClick={handleFunction}>
        {user.name}
        <CloseIcon pl={1}/>
    </Box>
  )
}

export default UserBadgeItem