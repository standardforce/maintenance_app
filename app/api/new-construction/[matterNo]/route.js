import pool from '@/lib/db';

export async function GET(req,context){
    const {matterNo}=context.params;

    try{
        const [rows]=await pool.query(
            `SELECT 
          tm.matter_no,
          tm.matter_name,
          mc.customer_name,
          tm.owner_name,
          tm.architecture_type,
          ma.address1,
          ma.address2,
          md.department_name,
          ms.staff_name,
          tm.update_at,
          tm.delivery_expected_date,
          tm.email,
          tm.telephone,
          tm.sixMonths,
          tm.oneYear,
          tm.threeYear,
          tm.tenYear,
          tm.period,
          tm.confirmationNotification
        FROM t_matter_infrapulse AS tm
        LEFT JOIN m_customer AS mc ON mc.id = tm.customer_id
        LEFT JOIN m_address AS ma ON ma.id = tm.address_id
        LEFT JOIN m_department AS md ON md.id = tm.department_id
        LEFT JOIN m_staff AS ms ON ms.id = tm.staff_id
        WHERE matter_no=?;`, [matterNo]
        );

        if(!Array.isArray(rows) || rows.length===0){
            return new Response(JSON.stringify({error:"matter not found"}),{status:404});
        }

      return new Response(JSON.stringify(rows[0]),{status:200});
    }
    catch(error){
        console.error("Database GET error:", error);
        return new Response(JSON.stringify({error:'server error'}),{status:500});
    }
}

export async function PUT(req, context) {
    const { matterNo } = context.params; // URL param (original matter number)
    const updatedData = await req.json(); // New form data
  
    try {
      const {
        matter_no,
        matter_name,
        owner_name,
        architecture_type,
        telephone,
        email,
        delivery_expected_date,
        sixMonths,
        oneYear,
        threeYear,
        tenYear,
        period,
        confirmationNotification,
      } = updatedData;
  
      await pool.query(
        `UPDATE t_matter_infrapulse
         SET 
           matter_no = ?,
           matter_name = ?,
           owner_name = ?,
           architecture_type = ?,
           telephone = ?,
           email = ?,
           delivery_expected_date = ?,
           sixMonths = ?,
           oneYear = ?,
           threeYear = ?,
           tenYear = ?,
           period = ?,
           confirmationNotification = ?
         WHERE matter_no = ?`,
        [
          matter_no,                    // New matter number (if allowed to change)
          matter_name,
          owner_name,
          architecture_type,
          telephone,
          email,
          delivery_expected_date,
          sixMonths,
          oneYear,
          threeYear,
          tenYear,
          JSON.stringify(period),       // Important: JSON.stringify the array
          confirmationNotification,
          matterNo                      // Original matter number for WHERE condition
        ]
      );
  
      return new Response(JSON.stringify({ message: 'Construction updated successfully' }), { status: 200 });
  
    } catch (error) {
      console.error('Database PUT error:', error);
      return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
    }
  }