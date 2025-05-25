export const ipcCommandMap = {
  toggleDevTools: {
    type: "command:help:devtools",
    command: "workbench.action.toggleDevTools"
  },
  openWelcome: {
    type: "command:help:welcome",
    command: "workbench.action.openWalkthrough"
  },
  openDocs: {
    type: "command:help:docs",
    command: "workbench.action.openDocumentationUrl"
  },
  openProcess: {
    type: "command:help:process",
    command: "workbench.action.openProcessExplorer"
  },
  openAbout: {
    type: "command:help:about",
    command: "workbench.action.showAboutDialog"
  },
  checkForUpdate: {
    type: "command:help:update",
    command: "update.checkForUpdate"
  },
  showCommands: {
    type: "command:help:showCommands",
    command: "workbench.action.showCommands"
  },
  openSettingsUI: {
    type: "command:help:settingsui",
    command: "workbench.action.openSettings2"
  },
  showCurrentReleaseNotes: {
    type: "command:update.showCurrentReleaseNotes",
    command: "update.showCurrentReleaseNotes"
  },
  // zoom
  zoomReset: {
    type: "command:workbench.action.zoomReset",
    command: "workbench.action.zoomReset"
  },
  zoomIn: {
    type: "command:workbench.action.zoomIn",
    command: "workbench.action.zoomIn"
  },
  zoomOut: {
    type: "command:workbench.action.zoomOut",
    command: "workbench.action.zoomOut"
  },

  // settings
  openSettings: {
    type: "command:help:settings",
    command: "workbench.action.openSettings"
  },
  openFolderSettings: {
    type: "command:help:foldersettings",
    command: "workbench.action.openFolderSettings"
  },
  openFolderSettingsJson: {
    type: "command:help:folersettings.json",
    command: "workbench.action.openFolderSettingsFile"
  },
  openRemoteSettingsJson: {
    type: "command:help:remotesettings.json",
    command: "workbench.action.openRemoteSettingsFile"
  },
  openRemoteSettings: {
    type: "command:help:remotesettings",
    command: "workbench.action.openRemoteSettings"
  },
  openEmoteSettingsJson: {
    type: "command:help:emotesettings.json",
    command: "workbench.action.openRemoteSettingsFile"
  },
  openEmoteSettings: {
    type: "command:help:emotesettings",
    command: "workbench.action.openRemoteSettings"
  },
  openUserSettings: {
    type: "command:help:usersettings",
    command: "workbench.action.openGlobalSettings"
  },
  openUserSettingsJson: {
    type: "command:help:usersettings.json",
    command: "workbench.action.openSettingsJson"
  },
  openWorkspaceSettings: {
    type: "command:help:workspacesettings",
    command: "workbench.action.openWorkspaceSettings"
  },
  openWorkspaceSettingsJson: {
    type: "command:help:workspacesettings.json",
    command: "workbench.action.openWorkspaceSettingsFile"
  }
}

const getCommandByType = (() => {
  const typeCommandMap: any = {}
  Object.values(ipcCommandMap).forEach(item => {
    typeCommandMap[item.type] = item
  })
  return (val: string) => typeCommandMap[val]?.command
})()

for (let i = 0; i < 10; i++) {
  const cmd = getCommandByType('command:help:welcome')
  console.log(cmd)
}
