import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiTrash2 } from "react-icons/fi";

import api from "../api/api";

function NavBar({ refreshKey = 0 }) {
  const [users, setUsers] = useState([]);
  const [mongoError, setMongoError] = useState("");
  const [deleteError, setDeleteError] = useState("");
  const [deletingKey, setDeletingKey] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    let mounted = true;

    const loadUsers = async () => {
      try {
        const { data } = await api.get("/users/recent", {
          params: {
            limit: 6,
          },
        });

        if (mounted) {
          setUsers(data?.users || []);
          setMongoError(data?.mongo?.connected ? "" : data?.mongo?.error || "");
        }
      } catch (error) {
        console.error("Failed to load saved users", error);
        if (mounted) {
          setMongoError("Unable to reach the backend users API.");
        }
      }
    };

    loadUsers();

    return () => {
      mounted = false;
    };
  }, [refreshKey]);

  const deleteSavedUser = async (user) => {
    const key = `${user.github_username}-${user.leetcode_username}`;

    try {
      setDeletingKey(key);
      setDeleteError("");

      const { data } = await api.delete("/users/profile", {
        params: {
          github_username: user.github_username,
          leetcode_username: user.leetcode_username,
        },
      });

      if (!data?.deleted) {
        setDeleteError("That profile was not found in MongoDB.");
        return;
      }

      setUsers((currentUsers) =>
        currentUsers.filter(
          (savedUser) =>
            `${savedUser.github_username}-${savedUser.leetcode_username}` !== key
        )
      );
    } catch (error) {
      console.error("Failed to delete saved user", error);
      setDeleteError("Unable to delete this profile from MongoDB.");
    } finally {
      setDeletingKey("");
    }
  };

  return (
    <header className="navBar">
      <a className="brand" href="#top" aria-label="AI DevConnect home">
        <span className="brandMark">DC</span>
          <span>DevLens AI</span>
      </a>

      <div className="navActions">
        <nav aria-label="Dashboard sections">
          <a href="#analytics">Analytics</a>
          <a href="#insights">Insights</a>
        </nav>

        <div className="savedUsersMenu">
          <button type="button" onClick={() => setOpen((value) => !value)}>
            Saved users
            <span>{users.length}</span>
          </button>

          {open && (
            <motion.div
              className="savedUsersPanel"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.18 }}
            >
              <div className="savedUsersHeader">
                <strong>MongoDB profiles</strong>
                <small>Recent saved analysis</small>
              </div>

              {deleteError && (
                <p className="savedUsersDeleteError">{deleteError}</p>
              )}

              {mongoError ? (
                <p className="savedUsersEmpty savedUsersError">
                  MongoDB is not connected: {mongoError}
                </p>
              ) : users.length ? (
                <div className="savedUsersList">
                  {users.map((user) => {
                    const userKey = `${user.github_username}-${user.leetcode_username}`;
                    const isDeleting = deletingKey === userKey;

                    return (
                    <article key={userKey} className="savedUserItem">
                      <div>
                        <strong>{user.github?.username || user.github_username}</strong>
                        <small>{user.leetcode_username} on LeetCode</small>
                      </div>

                      <div className="savedUserActions">
                        <button
                          type="button"
                          className="savedUserDelete"
                          onClick={() => deleteSavedUser(user)}
                          disabled={isDeleting}
                          aria-label={`Delete ${user.github_username} from saved users`}
                          title="Delete saved profile"
                        >
                          <FiTrash2 aria-hidden="true" />
                        </button>

                        <div className="savedUserScore">
                          {Math.round(user.developer_score || 0)}
                        </div>
                      </div>

                      <dl>
                        <div>
                          <dt>Repos</dt>
                          <dd>{user.github?.repos || 0}</dd>
                        </div>
                        <div>
                          <dt>Stars</dt>
                          <dd>{user.github?.stars || 0}</dd>
                        </div>
                        <div>
                          <dt>Solved</dt>
                          <dd>{user.leetcode?.totalSolved || 0}</dd>
                        </div>
                      </dl>

                      {user.linkedin?.headline && (
                        <p>{user.linkedin.headline}</p>
                      )}
                    </article>
                    );
                  })}
                </div>
              ) : (
                <p className="savedUsersEmpty">
                  No saved profiles yet. Run one successful analysis first.
                </p>
              )}
            </motion.div>
          )}
        </div>
      </div>
    </header>
  );
}

export default NavBar;
