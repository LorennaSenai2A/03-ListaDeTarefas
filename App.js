import { StatusBar } from "expo-status-bar";
import {
  Alert,
  FlatList,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

export default function App() {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [tasks,setTasks] = useState([]); //Estado para armazenar a lista de tarefas
  const [newTask,setNewTask] = useState(""); //Estado para o texto da nova tarefa

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const styles= createStyles(isDarkMode);

useEffect(() => {
  const loadTasks = async () => {
try{
const savedTasks = await AsyncStorage.getItem("tasks");
savedTasks && setTasks(JSON.parse(savedTasks));
}catch(error){
  console.error("Errp ao carregar as tarefas:", error);
}
};
loadTasks();
}, []);

useEffect(() =>{
  const saveTasks = async () => {
try{
  await AsyncStorage.setItem("tasks",JSON.stringify(tasks));
} catch (error) {
console.error("Erro ao salvar tarefas:", error);
}
};
  saveTasks();
}, [tasks]);

  const addTask = () => {
    if (newTask.trim().length > 0){
      //Garante que a tarefa não seja vazia
      setTasks((prevTasks)=>[
        ...prevTasks,
        {id: Date.now().toString(), text: newTask.trim(), completed: false }, //Cria uma nova tarefa com id unico
      ]);
      setNewTask(""); //Limpar o campo de input
      Keyboard.dismiss(); //Fecha o teclado do usuario
    }else{
      Alert.alert("Atenção", "Por favor, digite uma tarefa.");
    }
  };

  const toggleTaskCompleted = (id) => {
    setTasks((prevTasks)=>
      prevTasks.map((taks) =>
        taks.id === id ? { ...taks, completed: !taks.completed } : taks
  )
  );
  };

  const deleteTaks = (id) => {
    Alert.alert(
      "Confirmar exclusão",
      "Tem certeza que deseja excluir esta tarefa?",
      [
        {text: "Cancelar", style:"cancel"},
        {text: "Excluir", style: "destructive", 
onPress: () =>
  setTasks((prevTasks) => prevTasks.filter((task) => task.id 
!== id)),
        },
      ]
    );
  };

   const renderList = ({item}) => (
  <View style={styles.taskItem} key={item.id}>
  <TouchableOpacity style={styles.taskTextContainer}>
    <Text 
    style={[styles.taskText, item.completed && styles.completedTaskItem]}>
      {item.text}
      </Text>
  </TouchableOpacity>

  <TouchableOpacity onPress={() => deleteTaks(item.id)}>
    <Text style={styles.taskText}>🆇</Text>
  </TouchableOpacity>
  </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.topBarTitle}>Minhas Tarefas</Text>
        <TouchableOpacity onPress={toggleTheme}>
          <Text style={styles.emoji}>
            {isDarkMode ? "🌞" : "🌚"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Local onde o usuario insere as tarefas */}
      <View style={styles.card}>
        <TextInput
          style={styles.input}
          placeholder="Adicionar nova tarefa..."
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={addTask} //Adiciona a tarefa ao pressionar enter no teclado
        />
        <TouchableOpacity style={styles.addButton} onPress={addTask}>
          <Text style={styles.buttonText}>Adicionar</Text>
        </TouchableOpacity>
      </View>

      {/* Lista de tarefas do usuario */}
      <FlatList
        style={styles.flatList}
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={renderList}
        //renderItem={({ item }) => (
         // <View key={item.id} style={styles.taskItem}>
           // <Text>{item.text}</Text>
           // <TouchableOpacity>
           // <Text>🆇</Text>
           // </TouchableOpacity>
         // </View>
       // )}
        ListEmptyComponent={() => (
          <Text style={styles.emptyListText}>
            Nenhuma tarefa adicionada ainda.
          </Text>
        )}
        contentContainerStyle={styles.flatListContent}
      />
      

      <StatusBar style= {isDarkMode ? "light" : "dark"} /> 
    </View>
  );
}

const createStyles = (isDarkMode) =>
  StyleSheet.create({
    container: {
      backgroundColor: isDarkMode ? "#a75bdaff" : "#c390f6ff",
      flex: 1,
    },
    topBar: {
      backgroundColor: isDarkMode ? "#FF2DD1" : "#E9A5F1",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingHorizontal: 20,
      paddingTop: 50, // Ajuste para a barra de status
      paddingBottom: 15,
      borderBottomWidth: 1,
      borderBottomColor: isDarkMode ? "#333333" : "rgba(0,0,0,0.1)",
    },
    topBarTitle: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
      fontSize: 24,
      fontWeight: "bold",
    },
    emoji:{
      fontSize: 30,
    },
    card: {
      backgroundColor: isDarkMode ? "#91de70ff" : "#AEEA94",
      color: isDarkMode ? "#FFFFFF" : "#000000",
      shadowColor: isDarkMode ? "#FFFFFF" : "#000000",
      margin: 20,
      borderRadius: 15,
      padding: 20,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 10, // Elevar acima dos outros
    },
    input: {
      backgroundColor: isDarkMode ? "#FCFCFC" : "#FCFCFC",
      color: isDarkMode ? "#FFFFFF" : "#333333",
      borderColor: isDarkMode ? "#555555" : "#8897D680",
      borderWidth: 1,
      borderRadius: 15,
      padding: 20,
      fontSize: 18,
      marginBottom: 10,
    },
    addButton: {
      backgroundColor: isDarkMode ? "#FF2DD1" : "#E9A5F1",
      paddingVertical: 12,
      borderRadius: 10,
      alignItems: "center",
    },
    buttonText: {
      color: isDarkMode ? "#ffffff" : "#FFFFFF",
      fontSize: 18,
      fontWeight: "bold",
    },
    flatListContent: {
      paddingBottom: 10, // Espaçamento no final da lista
    },
    taskItem: {
      backgroundColor: isDarkMode ? "#91de70ff" : "#AEEA94",
      borderColor: isDarkMode ? "#555555" : "rgba(0,0,0,0.1)",
      color: isDarkMode ? "#FFFFFF" : "#333333",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      borderRadius: 10,
      padding: 15,
      marginVertical: 10,
      marginHorizontal: 15,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 3,
      elevation: 5,
      borderWidth: 1,
    },
    taskTextContainer: {
      flex: 1, // Permite que o texto ocupe o espaço disponível
      marginRight: 10,
    },
    taskText: {
      color: isDarkMode ? "#FFFFFF" : "#333333",
      fontSize: 18,
      flexWrap: "wrap", // Permite que o texto quebre linha
    },
    completedTaskItem: {
      textDecorationLine: "line-through", // Risca o texto
      opacity: 0.6,
    },
    deleteButton: {
      padding: 8,
      borderRadius: 5,
    },
    deleteButtonText: {
      color: isDarkMode ? "#FFFFFF" : "#000000",
      fontSize: 22,
      fontWeight: "bold",
    },
    emptyListText: {
      color: isDarkMode ? "#AAAAAA" : "#9e9e9e",
      textAlign: "center",
      marginTop: 50,
      fontSize: 16,
    },
  });