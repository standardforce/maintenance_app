import pool from "@/lib/db"

export async function POST(request){
    // const userId=authmiddleware(request);
    // console.log("Extracted userid:", userId)
    // if (!userId) {
    //     return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
    //   }
    const {companyName,clientName,address,telephone,email,drawings} = 
    await request.json();
    console.log("Received data:", {
        companyName,
        clientName,
        address,
        telephone,
        email,
        drawings,
      });
    try{
        await pool.query(
         "INSERT INTO constructions (company_name,client_name,address,telephone,email,drawings) VALUES (?,?,?,?,?,?)",
         [companyName,clientName,address,telephone,email,drawings]
        );

        return new Response(
            JSON.stringify({message:"Construction registered successfully done"}),
            {status:201}
        );
    }
    catch (error) {
        console.error("Construction registration error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
          status: 500,
    });
}
}


// export async function GET(request){
//     try{
//         const userId = authmiddleware(request);
//     console.log("Extracted userId:", userId);

//     if (!userId) {
//       return new Response(JSON.stringify({ message: "Unauthorized" }), { status: 401 });
//     }
//         const [rows]=await pool.query("SELECT * FROM constructions WHERE user_id=?", [userId]);
//         return new Response(JSON.stringify(rows),{
//             status:200,
//             headers:{
//                 "Content-Type":"application/json",
//             },
//         });
//     }
//     catch (error) {
//         console.error("Error in GET /api/constructions:", error);
//         return new Response(JSON.stringify({ message: error.message || "Internal Server Error" }), {
//             status: error.message.startsWith("Unauthorized") ? 401 : 500,
//         });
// }
// }
