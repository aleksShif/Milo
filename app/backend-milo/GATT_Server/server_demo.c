/*
 * UPDATED CODE WRITTEN BY:
 * Asma Ansari (ara89@cornell.edu)
 * 
 * Added functionality for reading an EMG sensor's data 
 * 
 * BASE CODE TAKEN FROM:
 * V. Hunter Adams (vha3@cornell.edu)
 * vanhunteradams.com
 * June, 2024
 * 
 * 
 * Demonstration of a custom GATT service. Connect to Pico server
 * using LightBlue or a similar app.
 */

// Standard libraries
#include <stdio.h>
#include <math.h>

// BTstack
#include "btstack.h"

// High-level libraries
#include "pico/cyw43_arch.h"
#include "pico/btstack_cyw43.h"
#include "pico/stdlib.h"

// Hardware API's
#include "hardware/timer.h"
#include "hardware/irq.h"
#include "hardware/spi.h"
#include "hardware/sync.h"
#include "hardware/adc.h"


// GAP and GATT
#include "GAP_Advertisement/gap_config.h"
#include "GATT_Service/service_implementation.h"

#define LED_PIN 25
static uint16_t emg_value = 0;

//BTstack objects
static btstack_data_source_t emg_characteristic;
static btstack_packet_callback_registration_t hci_event_callback_registration;

// Some data that we will communicate over Bluetooth
static int characteristic_a_val = 0 ;

// We send data as formatted strings (just like a serial console)
static char characteristic_a_tx[100] ;
static char characteristic_b_tx[100] ;
static char characteristic_c_tx[100] ;
static char characteristic_d_rx[100] ;
static char characteristic_e_tx[5] ;
static char characteristic_f_tx[2] ;


// Initialize ADC for MyoWare
void init_emg_sensor() {
    adc_init();
    adc_gpio_init(26);  // Connect MyoWare output to GPIO 26 (ADC0)
    adc_select_input(0); // Select ADC channel 0 (GPIO 26)
}

// Read EMG data
uint16_t read_emg_data() {
    return adc_read();  // Returns a 12-bit value (0–4095)
}


// EMG protothread
static PT_THREAD (protothread_emg(struct pt *pt))
{
    PT_BEGIN(pt) ;

    while(1) {
        // Read EMG data
        emg_value = read_emg_data();

        // Convert EMG value to string
        sprintf(emg_str, "%d", emg_value);
        
        // Send via characteristic C
        set_characteristic_c_value(emg_str);

        // Notify connected devices
        att_server_notify(emg_characteristic.handle, (uint8_t *)&emg_value, sizeof(emg_value));

        // Yield
        PT_YIELD_usec(10000); // Adjust delay as needed (e.g., 10ms)

    }

    PT_END(pt) ;
}

// Protothread that handles received Bluetooth data
static PT_THREAD (protothread_ble(struct pt *pt))
{
    PT_BEGIN(pt);

    while(1) {
        // Wait for a bluetooth event (signaled by bluetooth write callback)
        PT_SEM_SAFE_WAIT(pt, &BLUETOOTH_READY) ;

    }

  PT_END(pt);
}

int main() {
    // Initialize stdio
    stdio_init_all();

    // Initialize the LED pin
    gpio_init(LED_PIN);
    // Configure the LED pin as an output
    gpio_set_dir(LED_PIN, GPIO_OUT);
    // Set high
    gpio_put(LED_PIN, 1);
    // Sleep
    sleep_ms(1000);
    // Set low
    gpio_put(LED_PIN, 0);
    

    // initialize CYW43 driver architecture (will enable BT if/because CYW43_ENABLE_BLUETOOTH == 1)
    if (cyw43_arch_init()) {
        printf("failed to initialise cyw43_arch\n");
        return -1;
    }

    // Initialize L2CAP and security manager
    l2cap_init();
    sm_init();

    // Initialize ATT server, no general read/write callbacks
    // because we'll set one up for each service
    att_server_init(profile_data, NULL, NULL);   

    // Instantiate our custom service handler
    custom_service_server_init( characteristic_a_tx, characteristic_b_tx,
                                characteristic_c_tx, characteristic_d_rx,
                                characteristic_e_tx, characteristic_f_tx) ;

    // inform about BTstack state
    hci_event_callback_registration.callback = &packet_handler;
    hci_add_event_handler(&hci_event_callback_registration);

    // register for ATT event
    att_server_register_packet_handler(packet_handler);

    // turn on bluetooth!
    hci_power_control(HCI_POWER_ON);


    // Add threads, start threader
    pt_add_thread(protothread_ble);
    pt_add_thread(protothread_emg) ;
    pt_sched_method = SCHED_ROUND_ROBIN ;
    pt_schedule_start ;
    
}
