module.exports.templateTags = [
  {
    name: "cookiedecode",
    displayName: "Decoded cookie",
    description: "Get a decoded cookie using decodeURIComponent",
    liveDisplayName(args) {
      const [domain, id] = args;

      return `cookie${id.value && domain.value ? ` ${id.value}` : ""}`;
    },
    args: [
      {
        displayName: "Domain",
        description: "Domain",
        type: "string",
        defaultValue: "",
      },
      {
        displayName: "Cookie name",
        description: "Cookie name",
        type: "string",
        defaultValue: "",
      },
    ],
    async run(context, domain, key) {
      const workspace = await context.util.models.workspace.getById(
        context.meta.workspaceId
      );

      const { cookies } =
        await context.util.models.cookieJar.getOrCreateForWorkspace(workspace);

      const cookiesFilteredByDomain = cookies.filter(function (cookie) {
        return domain === cookie.domain;
      });

      const cookie = cookiesFilteredByDomain.find(function (cookie) {
        return key === cookie.key;
      });

      if (cookie) {
        return decodeURIComponent(cookie.value);
      } else {
        return Promise.reject(
          cookiesFilteredByDomain.length > 0
            ? `Available cookies for domain ${domain}: \n${cookiesFilteredByDomain
                .map(function (cookie) {
                  return `• ${cookie.key}`;
                })
                .join(", \n")}`
            : `No cookie available for domain ${domain}`
        );
      }
    },
  },
];
