import { cookies } from "next/headers";
import jwt from 'jsonwebtoken';

export async function GET(){
  try{
    const cookieStore=await cookies();
    const token=cookieStore.get('jwt')?.value;

    if(!token){
      return new Response(
        JSON.stringify({error:"Unauthorized: No token found"}),
        {status:401,headers:{
          'Content-Type':"application/json"
        }}
      )
    }

    const secret="dfsefergesrdgdfgdghfghfg"
    const payload=jwt.verify(token,secret);
    return new Response(
      JSON.stringify({success:true,payload}),
      {status:200,headers:{'Content-Type':'application/json'}}
    )
  }
  catch(error){
    console.error('Token verification error',error);
    return new Response(
      JSON.stringify({
        error:"Invalid or expired token"
      }),
      {status:401, headers:{'Content-Type':'application/json'}}
    )
  }
}


