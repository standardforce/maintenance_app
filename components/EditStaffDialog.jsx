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
  const { password, ...safeStaff } = staff;

  const [form, setForm] = useState({ ...safeStaff });
  const [showPasswordInput, setShowPasswordInput] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const payload = { ...form };

    // Don't include password if not set or empty
    if (!showPasswordInput || !form.password?.trim()) {
      delete payload.password;
    }

    try {
      const res = await fetch('/api/company-admin', {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: { 'Content-Type': 'application/json' },
      });

      if (!res.ok) {
        const err = await res.json();
        console.error('Update failed:', err.message);
      }
    } catch (err) {
      console.error('Error in update:', err);
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

          {/* Password (only if toggled) */}
          {showPasswordInput ? (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                New Password
              </Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="Enter new password"
                value={form.password || ''}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          ) : (
            <div className="grid grid-cols-4 items-center gap-4">
              <div></div>
              <Button
                variant="outline"
                className="col-span-3 bg-red-600 hover:bg-red-700 text-white hover:text-white"
                onClick={() => setShowPasswordInput(true)}
              >
                Set New Password
              </Button>
            </div>
          )}

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
