export class Utils{


    static toScreen(position, offset, scale) {
        return (position + offset) * scale;
    }
    
    static toTrue(screen, offset, scale) {
        return screen / scale - offset;
    }
    
}