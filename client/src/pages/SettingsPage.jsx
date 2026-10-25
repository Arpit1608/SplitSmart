import { useAuth } from '../context/AuthContext';
import { dateText } from '../utils/format';
import Avatar from '../components/ui/Avatar';

const label = { marginTop: 8 };

export default function SettingsPage() {
  const { user, logout } = useAuth();
  return (
    <>
      <div className="page-head">
        <div>
          <h1>Profile & settings</h1>
          <p>Your account details in one place.</p>
        </div>
      </div>

      <section className="panel" style={{ maxWidth: 700 }}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 15,
            paddingBottom: 22,
            borderBottom: '1px solid var(--line)',
            marginBottom: 22,
          }}
        >
          <Avatar name={user.name} style={{ width: 56, height: 56, fontSize: 20 }} />
          <div>
            <h2 style={{ margin: '0 0 4px' }}>{user.name}</h2>
            <span className="muted">@{user.username}</span>
          </div>
        </div>
        <div className="grid two-col">
          <div>
            <div className="eyebrow">DISPLAY NAME</div>
            <p style={label}>{user.name}</p>
          </div>
          <div>
            <div className="eyebrow">UNIQUE USERNAME</div>
            <p style={label}>@{user.username}</p>
          </div>
          <div>
            <div className="eyebrow">EMAIL ADDRESS</div>
            <p style={label}>{user.email}</p>
          </div>
          <div>
            <div className="eyebrow">MEMBER SINCE</div>
            <p style={label}>{dateText(user.createdAt)}</p>
          </div>
        </div>
        <div className="notice">
          Share your username with friends so they can add you to a group. Usernames are unique and are not
          case-sensitive when searching.
        </div>
        <button className="btn btn-outline" style={{ marginTop: 20 }} onClick={logout}>
          Log out
        </button>
      </section>
    </>
  );
}
