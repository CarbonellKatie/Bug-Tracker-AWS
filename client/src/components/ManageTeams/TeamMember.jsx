const TeamMember = ({ member }) => {
  return (
    <tr>
      <td>{member.user_id}</td>
      <td>{member.username}</td>
    </tr>
  );
};
export default TeamMember;
