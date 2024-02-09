import java.util.*;
public class k{

public static void main(String[] args)
{
    Scanner s = new Scanner(System.in);
    int c=0;
    System.out.println("Addition of two numbers");
    for(int i=0;i<10;i++){
    System.out.println("Enter the first number");
    int a=s.nextInt();
    if(a>=0)
    {
        System.out.println("Enter the second number");
        int b=s.nextInt();
        c=a+b;
        break;
    }
    else{
        System.out.println("Enter a positive number");
    }}
    System.out.println("Sum is "+c);
    s.close();
}
}