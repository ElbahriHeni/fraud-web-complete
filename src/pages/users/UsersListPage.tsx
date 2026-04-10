import { Link } from 'react-router-dom';
import PageHeader from '../../components/PageHeader';
import Table from '../../components/Table';
import { users } from '../../data/mockData';

export default function UsersListPage() {
  return (
    <div>
      <PageHeader title="User Management" subtitle="Manage users, roles and activation status." action={<Link className="btn primary" to="/users/new">Add User</Link>} />
      <div className="card filters-row">
        <input placeholder="Search by Full Name, Username or Email" />
        <select><option>All Roles</option><option>Fraud Team Member</option><option>System Administrator</option></select>
        <select><option>All Statuses</option><option>Active</option><option>Inactive</option></select>
      </div>
      <Table headers={['User Id', 'Full Name', 'Username', 'Email Address', 'Mobile Number', 'Role', 'Status', 'Creation Date', 'Actions']}>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.id}</td>
            <td>{user.fullName}</td>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.mobile}</td>
            <td>{user.role}</td>
            <td>{user.status}</td>
            <td>{user.creationDate}</td>
            <td><Link className="text-link" to={`/users/${user.id}`}>Open Details</Link></td>
          </tr>
        ))}
      </Table>
    </div>
  );
}
