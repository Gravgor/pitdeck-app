interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const requirements = [
    {
      regex: /.{8,}/,
      text: "At least 8 characters",
    },
    {
      regex: /[A-Z]/,
      text: "At least one uppercase letter",
    },
    {
      regex: /[a-z]/,
      text: "At least one lowercase letter",
    },
    {
      regex: /[0-9]/,
      text: "At least one number",
    },
    {
      regex: /[@$!%*?&]/,
      text: "At least one special character",
    },
  ];

  const strength = requirements.reduce(
    (count, requirement) => count + (requirement.regex.test(password) ? 1 : 0),
    0
  );

  const getStrengthColor = () => {
    if (strength <= 2) return "bg-red-500";
    if (strength <= 3) return "bg-yellow-500";
    if (strength <= 4) return "bg-blue-500";
    return "bg-green-500";
  };

  return (
    <div className="space-y-2">
      <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full transition-all duration-300 ${getStrengthColor()}`}
          style={{ width: `${(strength / requirements.length) * 100}%` }}
        />
      </div>
      <ul className="space-y-1">
        {requirements.map((requirement, index) => (
          <li
            key={index}
            className={`text-sm flex items-center gap-1 ${
              requirement.regex.test(password)
                ? "text-green-600"
                : "text-gray-500"
            }`}
          >
            {requirement.regex.test(password) ? "✓" : "○"} {requirement.text}
          </li>
        ))}
      </ul>
    </div>
  );
} 