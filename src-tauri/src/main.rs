// Imports required by Tauri and the window_vibrancy crate
#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]
use tauri::Manager;
use window_vibrancy::{apply_blur, apply_vibrancy, NSVisualEffectMaterial};

// IPC command to dynamically apply a sidebar blur on macOS
#[tauri::command]
fn apply_sidebar_blur(window: tauri::Window) {
    #[cfg(target_os = "macos")]
    {
        println!("test");
        // Try clearing effects by hiding and showing the window
    
    }
}



// Main function setting up the Tauri application
fn main() {
  tauri::Builder::default()
      // Register the IPC command handler
      .invoke_handler(tauri::generate_handler![apply_sidebar_blur])
      .setup(|app| {
          let window = app.get_window("main").unwrap();

          // Initial window effect settings
          #[cfg(target_os = "macos")]
          apply_vibrancy(&window, NSVisualEffectMaterial::HudWindow, None, None)
              .expect("Unsupported platform! 'apply_vibrancy' is only supported on macOS");

          #[cfg(target_os = "windows")]
          apply_blur(&window, Some((18, 18, 18, 125)))
              .expect("Unsupported platform! 'apply_blur' is only supported on Windows");

          Ok(())
      })
      .run(tauri::generate_context!())
      .expect("error while running tauri application");
}
