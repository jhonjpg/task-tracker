import React, { useState } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Pressable, 
  Text, 
  ScrollView 
} from 'react-native';

export default function App() {
  // Step 1: Add state
  const [enteredTask, setEnteredTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // Step 4: Logic
  const addTaskHandler = () => {
    if (enteredTask.trim().length === 0) return;

    // Add task to array
    setTasks((currentTasks) => [...currentTasks, enteredTask]);
    
    // Clear input
    setEnteredTask('');
  };

  return (
    <View style={styles.container}>
      {/* Step 2: Input */}
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="New Task..."
          style={styles.textInput}
          onChangeText={(text) => setEnteredTask(text)}
          value={enteredTask}
        />

        {/* Step 3: Button */}
        <Pressable 
          onPress={addTaskHandler} 
          style={({ pressed }) => [
            styles.button, 
            pressed && styles.buttonPressed
          ]}
        >
          <Text style={styles.buttonText}>ADD</Text>
        </Pressable>
      </View>

      {/* Step 5: Render list */}
      <ScrollView style={styles.listContainer}>
        {tasks.map((task, index) => (
          <View key={index} style={styles.listItem}>
            <Text style={styles.itemText}>{task}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 60,
    paddingHorizontal: 20,
    backgroundColor: '#f4f4f4',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  textInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    elevation: 2,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  listContainer: {
    marginTop: 10,
  },
  listItem: {
    padding: 15,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 8,
    marginBottom: 10,
  },
  itemText: {
    fontSize: 16,
    color: '#333',
  },
});