import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  Pressable, 
  Text, 
  ScrollView 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function App() {
  const [enteredTask, setEnteredTask] = useState('');
  const [tasks, setTasks] = useState([]);

  // --- PERSISTENCE LOGIC ---

  // Load data on startup
  useEffect(() => {
    loadTasks();
  }, []);

  // Save data whenever the tasks array changes
  useEffect(() => {
    saveTasks(tasks);
  }, [tasks]);

  const saveTasks = async (tasksToSave) => {
    try {
      const jsonValue = JSON.stringify(tasksToSave);
      await AsyncStorage.setItem('@task_list', jsonValue);
    } catch (e) {
      console.log('Error saving data', e);
    }
  };

  const loadTasks = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@task_list');
      if (jsonValue != null) {
        setTasks(JSON.parse(jsonValue));
      }
    } catch (e) {
      console.log('Error loading data', e);
    }
  };

  // --- HANDLERS ---

  const addTaskHandler = () => {
    if (enteredTask.trim().length === 0) return;

    setTasks((currentTasks) => [
      ...currentTasks,
      { text: enteredTask, id: Math.random().toString() }
    ]);
    
    setEnteredTask('');
  };

  const deleteTaskHandler = (id) => {
    setTasks((currentTasks) => {
      return currentTasks.filter((task) => task.id !== id);
    });
  };

  return (
    <View style={styles.appContainer}>
      <View style={styles.inputContainer}>
        <TextInput 
  placeholder="What needs doing?"
  style={styles.textInput} 
  onChangeText={setEnteredTask} 
  value={enteredTask} 
  onSubmitEditing={addTaskHandler} // <--- Add this line
  returnKeyType="done"             // <--- Changes the keyboard button to "Done" or "Enter"
/>
        <Pressable 
          style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]} 
          onPress={addTaskHandler}
        >
          <Text style={styles.buttonText}>ADD</Text>
        </Pressable>
      </View>

      <View style={styles.listContainer}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {tasks.map((task) => (
            <Pressable 
              key={task.id} 
              onPress={() => deleteTaskHandler(task.id)}
              style={({ pressed }) => [pressed && styles.pressedItem]}
            >
              <View style={styles.taskItem}>
                <Text style={styles.taskText}>{task.text}</Text>
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
  buttonPressed: { opacity: 0.6 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
  listContainer: { flex: 1 },
  taskItem: {
    backgroundColor: '#f0f0f0',
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#007AFF',
  },
  pressedItem: { opacity: 0.5 },
  taskText: { fontSize: 16, color: '#333333' },
});