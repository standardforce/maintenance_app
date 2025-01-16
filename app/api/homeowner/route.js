import pool from "@/lib/db"

export async function POST(request){
    const {name,phone,email}=await request.json();
    try{
        await pool.query(
            "INSERT INTO homeowners (name,phone,email) VALUES (?,?,?)",
           [name,phone,email]
        );

        return new Response(JSON.stringify({message:"homeowner registration successfully done"}),{
            status:201
        });

    }
    catch (error) {
        console.error("HouseOwner registration error:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
          status: 500,
    });
}
}

export async function GET(){
    try{
        const [rows]=await pool.query("SELECT * FROM homeowners")

        return new Response(JSON.stringify(rows),{
            status:200,
            headers:{
                "Content-Type":"application/json"
            }
        });
    }
    catch (error) {
        console.error("Error fetching owners:", error);
        return new Response(JSON.stringify({ message: "Internal Server Error" }), {
          status: 500,
        });
}
}