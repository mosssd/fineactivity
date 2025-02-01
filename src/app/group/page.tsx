
import React from 'react';
import { getServerSession } from 'next-auth';
import GroupPageComponent from '../components/GroupPage';
import { authOptions } from '../api/auth/[...nextauth]/route';

async function GroupPage() {
  const session = await getServerSession(authOptions);
  if(session === null) {
    return <div>Loading...</div>
  }
  return (
    <GroupPageComponent 
     session = {session}
    />
  )
}

export default GroupPage
