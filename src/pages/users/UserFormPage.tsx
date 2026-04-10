import { useParams } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import { users } from '../../data/mockData';

interface Props { mode: 'create' | 'details'; }

export default function UserFormPage({ mode }: Props) {
  const { userId } = useParams();
  const user = users.find((item) => item.id === userId);
  const isCreate = mode === 'create';

  return (
    <div>
      <PageHeader title={isCreate ? 'Add User' : `User Details - ${user?.fullName ?? userId}`} subtitle="Create a new user or update user information." />
      <div className="card form-card">
        <div className="form-grid two-col-form">
          <label><span>Full Name</span><input defaultValue={user?.fullName ?? ''} /></label>
          <label><span>Username</span><input defaultValue={user?.username ?? ''} /></label>
          <label><span>Email Address</span><input defaultValue={user?.email ?? ''} /></label>
          <label><span>Mobile Number</span><input defaultValue={user?.mobile ?? ''} /></label>
          <label><span>Role</span><select defaultValue={user?.role ?? 'Fraud Team Member'}><option>Fraud Team Member</option><option>System Administrator</option></select></label>
          <label><span>Status</span><select defaultValue={user?.status ?? 'Active'}><option>Active</option><option>Inactive</option></select></label>
          <label><span>Temporary Password</span><input type="password" /></label>
          <label><span>Confirm Password</span><input type="password" /></label>
        </div>
        <div className="actions-inline top-gap">
          <button className="btn primary">{isCreate ? 'Save' : 'Update'}</button>
          {!isCreate ? <button className="btn">Reset Password</button> : null}
          <button className="btn">Cancel</button>
        </div>
      </div>
    </div>
  );
}
