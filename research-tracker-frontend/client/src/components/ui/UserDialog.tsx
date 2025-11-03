// src/components/UserDialog.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { RoleSelect } from './RoleSelect';
import { User, UserRole, CreateUserRequest, UpdateUserRequest } from '@/lib/types';
import { toast } from 'sonner';
import { api } from '@/lib/api';
import React from 'react';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: 'create' | 'edit';
  user?: User;               // only for edit
  onSuccess: () => void;     // refresh list
}

export function UserDialog({ open, onOpenChange, mode, user, onSuccess }: Props) {
  const isEdit = mode === 'edit';

  const [form, setForm] = React.useState<
    CreateUserRequest | UpdateUserRequest
  >(
    isEdit
      ? { fullName: user!.fullName, username: user!.username, role: user!.role }
      : { username: '', fullName: '', password: '', role: UserRole.MEMBER }
  );

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await api.put(`/users/${user!.id}`, form);
        toast.success('User updated');
      } else {
        await api.post('/users', form);
        toast.success('User created');
      }
      onSuccess();
      onOpenChange(false);
    } catch (e: any) {
      toast.error(e?.response?.data?.message || 'Operation failed');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEdit ? 'Edit User' : 'Create New User'}</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label>Full Name</Label>
            <Input
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
            />
          </div>

          <div className="grid gap-2">
            <Label>{isEdit ? 'Username (optional change)' : 'Username'}</Label>
            <Input
              disabled={isEdit}
              value={isEdit ? form.username ?? '' : form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
            />
          </div>

          {!isEdit && (
            <div className="grid gap-2">
              <Label>Password</Label>
              <Input
                type="password"
                value={(form as CreateUserRequest).password ?? ''}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value } as CreateUserRequest)
                }
              />
            </div>
          )}

          <div className="grid gap-2">
            <Label>Role</Label>
            <RoleSelect
              value={form.role}
              onChange={(v) => setForm({ ...form, role: v })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>{isEdit ? 'Save' : 'Create'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}