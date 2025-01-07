import screenshot from 'screenshot-desktop';
import fs from 'fs';

export async function getScreens() {
  try {
    return await screenshot.listDisplays()
  } catch (error) {
    console.error('Error fetching screens:', error)
    return []
  }
}

export async function takeScreenshot(screenId: string) {
  const tempFilePath = `screenshot_${Date.now()}.png`
  try {
    await screenshot({ screen: screenId, filename: tempFilePath })
    return tempFilePath
  } catch (error) {
    console.error('Error taking screenshot:', error)
    throw error
  }
}

export function cleanupFile(filePath: string) {
  try {
    fs.unlinkSync(filePath)
  } catch (error) {
    console.error('Error removing file:', filePath, error)
  }
}

module.exports = { getScreens, takeScreenshot, cleanupFile }
