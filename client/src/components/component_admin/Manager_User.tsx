import React, { useEffect, useState } from "react";
import "../../assets/asests_Admin/ManagerUser.css";
import { useDispatch, useSelector } from "react-redux";
import { changeStatus, renderUser } from "../../services/account.service";
import { User } from "../../interfaces/page";

export default function Manager_User() {
  const [valueSearch, setValueSearch] = useState<string>("");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [usersPerPage] = useState<number>(1); // số lượng người dùng trên mỗi trang

  // get user
  const users: User[] = useSelector((state: any) => {
    return state.users.accountUser;
  });

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(renderUser());
  }, [dispatch]);

  const changeStatusUser = (id: number, status: boolean) => {
    dispatch(changeStatus({ id, status: status }));
  };

  // search Input
  const searchInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValueSearch(e.target.value);
    setCurrentPage(1); // reset về trang đầu tiên khi tìm kiếm
  };

  // Filter users based on search input
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(valueSearch.toLowerCase())
  );

  // Logic for displaying users
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Change page
  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <>
      <div className="table-container-user-admin">
        <div className="search-bar">
          <input onChange={searchInput} type="text" placeholder="Search..." />
        </div>
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>AVATAR</th>
              <th>NAME</th>
              <th>EMAIL</th>
              <th>CREATE AT</th>
              <th>STATUS</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((item: User, index: number) => (
              <tr key={index}>
                <td>{item.id}</td>
                <td>
                  <img src={item.avatar} alt={item.name} />
                </td>
                <td>{item.name}</td>
                <td>{item.email}</td>
                <td>{item.created_at}</td>
                <td>
                  {item.status === true ? (
                    <button
                      onClick={() => changeStatusUser(item.id, false)}
                      className="btn red"
                    >
                      Lock
                    </button>
                  ) : (
                    <button
                      onClick={() => changeStatusUser(item.id, true)}
                      className="btn blue"
                    >
                      Unlock
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="pagination">
          {pageNumbers.map((number) => (
            <li
              key={number}
              onClick={() => paginate(number)}
              className="page-item"
            >
              <a className="page-link" href="#">
                {number}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}
