const form = document.querySelector<HTMLFormElement>("#apiKeyForm");
const apiKeyInput = form?.querySelector<HTMLInputElement>('[name="apiKey"]');
const workspaceIdInput = form?.querySelector<HTMLInputElement>(
  '[name="workspaceId"]'
);
const statusElement =
  document.querySelector<HTMLParagraphElement>("#saveStatus");

const setStatus = (message: string): void => {
  if (!statusElement) {
    return;
  }
  statusElement.textContent = message;
  if (message.length === 0) {
    return;
  }
  globalThis.setTimeout(() => {
    if (statusElement.textContent === message) {
      statusElement.textContent = "";
    }
  }, 2000);
};

if (form && apiKeyInput && workspaceIdInput) {
  globalThis.chrome.storage.sync
    .get(["apiKey", "workspaceId"])
    .then((result) => {
      const storedApiKey =
        typeof result.apiKey === "string" ? result.apiKey : "";
      const storedWorkspaceId =
        typeof result.workspaceId === "string" ? result.workspaceId : "";
      apiKeyInput.value = storedApiKey;
      workspaceIdInput.value = storedWorkspaceId;
    })
    .catch((error) => {
      console.error("Failed to load credentials from storage:", error);
      setStatus("Failed to load saved settings.");
    });

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const formData = new FormData(form);
    const rawValue = formData.get("apiKey");
    if (typeof rawValue !== "string") {
      setStatus("API key must be text.");
      return;
    }
    const trimmedValue = rawValue.trim();
    apiKeyInput.value = trimmedValue;
    const rawWorkspaceId = formData.get("workspaceId");
    if (typeof rawWorkspaceId !== "string") {
      setStatus("Workspace ID must be text.");
      return;
    }
    const trimmedWorkspaceId = rawWorkspaceId.trim();
    workspaceIdInput.value = trimmedWorkspaceId;
    const storagePayload = {
      apiKey: trimmedValue,
      workspaceId: trimmedWorkspaceId,
    } satisfies Record<string, string>;
    globalThis.chrome.storage.sync
      .set(storagePayload)
      .then(() => {
        const statusMessages: string[] = [];
        statusMessages.push(
          trimmedValue.length > 0 ? "Saved API key." : "Cleared API key."
        );
        statusMessages.push(
          trimmedWorkspaceId.length > 0
            ? "Saved workspace ID."
            : "Cleared workspace ID."
        );
        setStatus(statusMessages.join(" "));
      })
      .catch((error) => {
        console.error("Failed to save credentials:", error);
        setStatus("Failed to save settings.");
      });
  });
}
