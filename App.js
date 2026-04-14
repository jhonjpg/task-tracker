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
  const [enteredTask, setEnteredTask] = useState('');
  const [tasks, setTasks] = useState([]);

  const addTaskHandler = () => {
    if (enteredTask.trim().length === 0) return;
    setTasks((currentTasks) => [...currentTasks, enteredTask]);
    setEnteredTask('');
  };

  // NEW: Delete Logic
  const deleteTaskHandler = (index) => {
    setTasks((currentTasks) => {
      return currentTasks.filter((task, i) => i !== index);
    });
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="New task..."
          style={styles.textInput}
          onChangeText={(text) => setEnteredTask(text)}
          value={enteredTask}
        />
        <Pressable 
          style={({ pressed }) => [
            styles.button, 
            pressed && styles.buttonPressed
          ]} 
          onPress={addTaskHandler}
        >
          <Text style={styles.buttonText}>ADD</Text>
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {tasks.map((task, index) => (
            /* Wrap each item in Pressable to make it deletable */
            <Pressable 
              key={index} 
              onPress={() => deleteTaskHandler(index)}
              style={({ pressed }) => [pressed && styles.pressedItem]}
            >
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>{task}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 70,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
  },
  inputContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  textInput: {
    width: '75%',
    borderWidth: 1,
    borderColor: '#e2e2e2',
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 70,
  },
  buttonPressed: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  listContainer: {
    flex: 1,
  },
  taskItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  pressedItem: {
    opacity: 0.5,
  },
  taskText: {
    fontSize: 16,
    color: '#333333',
  },
});