import { UserRound, AtSign, Mail, LockKeyhole } from "lucide-react";
 
type props = {
  data: {
    displayName: string;
    username: string;
    email: string;
  };
}


const ProfileFields = ({
  data
}: props) => {

  const fields = [
    {
      name: "displayName",
      label: "Display Name",
      value: data.displayName,
      icon: UserRound,
    },
    {
      name: "username",
      label: "Username",
      value: data.username,
      icon: AtSign,
    },
    {
      name: "email",
      label: "Email Address",
      value: data.email,
      icon: Mail,
    },{
      name: "password",
      label: "Password",
      value: "••••••••••••",
      icon: LockKeyhole,
    },
  ];

  return (
    <div className="rounded-2xl border border-gray-400/50 divide-y divide-gray-200">
      {fields.map((field) => {
        const Icon = field.icon;

        return (
          <div key={field.name} className="flex items-center gap-4 p-4">
            <Icon size={22} className="text-gray-500 shrink-0" />

            <div className="flex-1 min-w-0">
              <label className="block text-sm text-gray-500 mb-1">
                {field.label}
              </label>

              <p className="font-medium wrap-break">{field.value}</p>
            </div>
           
          </div>
        );
      })}
    </div>
  );
};

export default ProfileFields;