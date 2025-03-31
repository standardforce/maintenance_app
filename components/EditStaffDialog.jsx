'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';

import { useState } from 'react';

export default function EditStaffDialog({ staff, onClose }) {
  const [form, setForm] = useState({ ...staff });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await fetch('/api/company-admin', {
        method: 'POST',
        body: JSON.stringify(form),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const err = await res.json();
        console.error("Update failed:", err.message);
      }
    } catch (err) {
      console.error("Error in update:", err);
    }

    onClose();
  };

  return (
    <Dialog open={!!staff} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Staff Details</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {/* Standard input fields */}
          {[
            ['staff_name', 'Staff Name'],
            ['staff_kana', 'Kana'],
            ['employee_code', 'Employee Code'],
            ['email', 'Email'],
            ['login_id', 'Login ID'],
            ['password', 'Password'],
            ['tel_1', 'Phone Number'],
          ].map(([field, label]) => (
            <div key={field} className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor={field} className="text-right">
                {label}
              </Label>
              <Input
                id={field}
                name={field}
                value={form[field] || ''}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          ))}

          {/* Role dropdown */}
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="role" className="text-right">
              Role
            </Label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="col-span-3 px-3 py-2 border rounded-md"
            >
              <option value="company_admin">company_admin</option>
              <option value="staff_user">staff_user</option>
            </select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
